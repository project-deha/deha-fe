'use client';

import React from 'react';
import TurkeyMap from 'turkey-map-react';
import { Tooltip } from "antd";

import turkeyCities from '@/data/Cities';

function TooltipContent({ data }: { data: number | undefined }) {
    return <div>
        <p>Possibility is {data}</p>
        <button className='bg-blue-500 text-white p-2 rounded-md'>click me</button>
    </div>
}

export function Map() {

    const cityWrapper = (cityComponent: JSX.Element, city: any) => {
        const highlightedCity = turkeyCities.cities.find(c => c.possibility && c.plateNumber === city.plateNumber);

        return <Tooltip title={<TooltipContent data={highlightedCity?.possibility} />} key={`city-${city.plateNumber}`}>
            {React.cloneElement(cityComponent, {
                style: {
                    fill: highlightedCity ? 'blue' : '#800020',
                }
            })}
        </Tooltip>;
    };

    return (
        <div className="relative w-full h-[600px]">
            <TurkeyMap

                showTooltip={false}
                customStyle={{
                    idleColor: "inherit",
                    hoverColor: "lightblue",
                }}
                hoverable={true}
                cityWrapper={cityWrapper}
            />
        </div>
    );
} 