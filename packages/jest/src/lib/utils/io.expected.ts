export const expectedTsConfig = `{
	"compilerOptions": {
		"rootDir": ".",
		"sourceMap": true,
		"declaration": false,
		"moduleResolution": "node",
		"emitDecoratorMetadata": true,
		"experimentalDecorators": true,
		"importHelpers": true,
		"target": "es2015",
		"module": "esnext",
		"lib": ["es2017", "dom", "ES2019"],
		"skipLibCheck": true,
		"skipDefaultLibCheck": true,
		"baseUrl": "."
	}
}`