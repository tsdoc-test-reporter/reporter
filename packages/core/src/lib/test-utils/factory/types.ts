/**
 * @internal
 * @hidden
 */
export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends (infer U)[]
		? DeepPartial<U>[]
		: T[P] extends Readonly<infer U>[]
		? Readonly<DeepPartial<U>>[]
		: DeepPartial<T[P]>;
};

/**
 * @internal
 * @hidden
 */
export type TestDataFactory<Model, ReturnModel = Model> = (
	overrides?: DeepPartial<Model>,
) => ReturnModel;
