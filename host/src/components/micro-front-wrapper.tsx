import React from 'react';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// @ts-ignore
const RemoteApp = React.lazy( () => {
    return new Promise(res => {
        setTimeout(() => {
            // @ts-ignore
            import('microApp/moduleName').then(res)
        }, 2000);
    })
});

export const MicroFrontWrapper = () => {
    return (
        <div>
            <h1>This is micro front</h1>
            <React.Suspense fallback={<div>Loading MicroApp...</div>}>
                <RemoteApp />
            </React.Suspense>
        </div>
    );
};