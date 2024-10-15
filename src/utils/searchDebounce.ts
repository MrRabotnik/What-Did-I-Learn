let timeout: any;

const SearchDebounce = (fn: any, delay: number) => {
    return (...args: any) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};

export default SearchDebounce;
