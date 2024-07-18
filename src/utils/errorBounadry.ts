

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
    }
}

export default errorBoundary;