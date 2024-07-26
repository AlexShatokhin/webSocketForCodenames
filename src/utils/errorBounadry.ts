

const errorBoundary = (callback : (...args : any) => void, args : any[]) => {
    try {
        callback(...args);
    } catch (error) {
        if(error instanceof Error)
            console.error(`
            !!ERROR!!
            Type: ${error.name}
            Message: ${error.message}
        `);
        if(args[args.length - 1] instanceof Function)
            args[args.length - 1]({
                statusCode: 500,
                ok: false
            });
    }
}

export default errorBoundary;