declare module 'react-simple-maps' {
    import { FC } from 'react';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export const ComposableMap: FC<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export const Geographies: FC<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export const Geography: FC<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export const geoCentroid: (feature: any) => [number, number] | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export const geoMercator: () => any;
} 