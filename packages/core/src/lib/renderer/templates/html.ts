// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const html = (strings: any, ...values: any) => String.raw({ raw: strings }, ...values);
