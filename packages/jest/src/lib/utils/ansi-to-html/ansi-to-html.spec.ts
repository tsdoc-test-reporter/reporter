import { AnsiToHtmlConverter } from '.';

test('ansi to html conversion', () => {
	const converter = new AnsiToHtmlConverter({});
	expect(
		converter.toHtml(
			'\u001b[2mexpect(\u001b[22m\u001b[31mreceived\u001b[39m\u001b[2m)'
		)
	).toEqual(
		'expect(<span style="font-weight:normal;text-decoration:none;font-style:normal"><span style="color:#A00">received<span style="color:#FFF">)</span></span></span>'
	);
});
