import { parseAsBoolean, useQueryStates } from "nuqs";

export const useCheckoutStates = () => {
    return useQueryStates({
        success: parseAsBoolean.withDefault(false).withOptions({
            clearOnDefault: true,
        }),
        cancal: parseAsBoolean.withDefault(false).withOptions({
            clearOnDefault: true,
        }), 
    });
};