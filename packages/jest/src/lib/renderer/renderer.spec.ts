import { test, expect, describe } from 'vitest';
import { UITestError, UITestResult } from '@tsdoc-test-reporter/core';
import { toUITestResult, toUIErrors } from './index';
import { taggedAssertionResultFactory, taggedTestResultFactory } from '../test-utils/factory';

describe('ui result', () => {
	test('convert to ui result', () => {
		expect(
			toUITestResult({ aggregateTagsToFileHeading: true })(
				taggedTestResultFactory({
					testFilePath: 'test-file-path.ts',
					numPassingTests: 1,
					testResults: [
						{
							title: 'test name',
							status: 'passed',
							testBlockComments: [
								{
									testBlockName: 'test',
									type: 'test',
									testBlockTags: {
										'@alpha': {
											name: '@alpha',
											testBlockName: 'test',
											testTitle: 'test name',
											type: 'standard',
											kind: 'modifier',
										},
									},
								},
							],
						},
					],
				}),
			),
		).toEqual<UITestResult>({
			aggregatedTags: [
				{
					icon: undefined,
					text: '@alpha',
					type: 'test',
					name: '@alpha',
				},
			],
			assertions: [
				{
					title: 'test name',
					ancestorTitles: [],
					status: 'pass',
					tags: [
						{
							icon: undefined,
							text: '@alpha',
							type: 'test',
							name: '@alpha',
						},
					],
				},
			],
			meta: {
				failed: 0,
				passed: 1,
				skipped: 0,
				todo: 0,
			},
			title: 'test-file-path.ts',
		});
	});

	test('convert nested to ui result', () => {
		expect(
			toUITestResult({ aggregateTagsToFileHeading: true })(
				taggedTestResultFactory({
					testFilePath: 'test-file-path.ts',
					testResults: [
						{
							title: 'test name',
							status: 'passed',
							ancestorTitles: ['describe name'],
							testBlockComments: [
								{
									testBlockName: 'test',
									type: 'test',
									testBlockTags: {
										'@alpha': {
											name: '@alpha',
											testBlockName: 'test',
											testTitle: 'test name',
											type: 'standard',
											kind: 'modifier',
										},
									},
								},
								{
									testBlockName: 'describe',
									type: 'ancestor',
									testBlockTags: {
										'@beta': {
											name: '@beta',
											testBlockName: 'describe',
											testTitle: 'describe name',
											type: 'standard',
											kind: 'modifier',
										},
									},
								},
							],
						},
					],
				}),
			),
		).toEqual<UITestResult>({
			aggregatedTags: [
				{
					icon: undefined,
					name: '@alpha',
					text: '@alpha',
					type: 'test',
				},
				{
					icon: undefined,
					name: '@beta',
					text: '@beta',
					type: 'ancestor',
				},
			],
			assertions: [
				{
					title: 'test name',
					ancestorTitles: ['describe name'],
					status: 'pass',
					tags: [
						{
							icon: undefined,
							name: '@alpha',
							text: '@alpha',
							type: 'test',
						},
						{
							icon: undefined,
							name: '@beta',
							text: '@beta',
							type: 'ancestor',
						},
					],
				},
			],
			meta: {
				failed: 0,
				passed: 1,
				skipped: 0,
				todo: 0,
			},
			title: 'test-file-path.ts',
		});
	});

	test('hide ancestor tags and titles', () => {
		expect(
			toUITestResult({ hideAncestorTags: true, hideAncestorTitles: true })(
				taggedTestResultFactory({
					testFilePath: 'test-file-path.ts',
					testResults: [
						{
							title: 'test name',
							status: 'passed',
							ancestorTitles: ['describe name'],
							testBlockComments: [
								{
									testBlockName: 'test',
									type: 'test',
									testBlockTags: {
										'@alpha': {
											name: '@alpha',
											testBlockName: 'test',
											testTitle: 'test name',
											type: 'standard',
											kind: 'modifier',
										},
									},
								},
								{
									testBlockName: 'describe',
									type: 'ancestor',
									testBlockTags: {
										'@beta': {
											name: '@beta',
											testBlockName: 'describe',
											testTitle: 'describe name',
											type: 'standard',
											kind: 'modifier',
										},
									},
								},
							],
						},
					],
				}),
			),
		).toEqual<UITestResult>({
			aggregatedTags: undefined,
			assertions: [
				{
					title: 'test name',
					ancestorTitles: undefined,
					status: 'pass',
					tags: [
						{
							icon: undefined,
							name: '@alpha',
							text: '@alpha',
							type: 'test',
						},
					],
				},
			],
			meta: {
				failed: 0,
				passed: 1,
				skipped: 0,
				todo: 0,
			},
			title: 'test-file-path.ts',
		});
	});
});

describe('get test errors', () => {
	test('with matcher results', () => {
		expect(
			toUIErrors(
				taggedAssertionResultFactory({
					failureDetails: [
						{
							matcherResult: {
								message: 'message',
							},
						},
					],
				}),
			),
		).toEqual<UITestError[]>([{ message: 'message', name: 'message' }]);
	});

	test('with named result', () => {
		expect(
			toUIErrors(
				taggedAssertionResultFactory({
					failureDetails: [
						{
							name: 'fail name',
							matcherResult: undefined,
						},
					],
					failureMessages: ['details'],
				}),
			),
		).toEqual<UITestError[]>([{ message: 'details', name: 'fail name' }]);
	});
});
