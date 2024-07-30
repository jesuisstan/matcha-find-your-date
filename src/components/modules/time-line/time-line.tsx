'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { z } from 'zod';

import TimelineSkeleton from './time-line-skeleton';

import { Slider } from '@/components/ui/slider';

// Define schema
const dataSchema = z.object({ geoId: z.string(), date: z.string(), url: z.string() }).array();
// Define type
type TData = z.infer<typeof dataSchema>;
// Define props
type TProps = {
  data: TData;
  label: string;
  loading?: boolean;
};

const TimeLine = (props: TProps) => {
  const { data, label, loading } = props;

  // Length of object
  const length = data.length;

  // State for slider
  const [selectedValue, setSelectedValue] = useState<number>(length - 1);

  // State error
  const [error, setError] = useState<string | null>(null);

  // Verif props data
  const validData = dataSchema.safeParse(data);

  useEffect(() => {
    if (data && length < 1) {
      setError('No data');
    }
    if (!validData.success) {
      setError('Invalid data');
    }
  }, [validData, data, length]);

  return (
    <>
      {loading && <TimelineSkeleton />}
      <div>
        {error ? (
          <div>
            <p>{error}</p>
          </div>
        ) : (
          <div className="h-max">
            <h1 className="p-2 text-center font-semibold">{label}</h1>
            <Image
              className="m-auto h-auto w-auto p-4"
              src={data[selectedValue]?.url}
              alt="image"
              width={600}
              height={400}
              placeholder="blur"
              blurDataURL={data[selectedValue]?.url}
            />
            <Slider
              className="p-2"
              defaultValue={[length]}
              max={length - 1}
              step={1}
              onValueChange={(value: number[]) => setSelectedValue(value[0])}
            />
            <div className="flex justify-between pt-2">
              <p className="text-sm">{data[0]?.date.split('T')[0]}</p>
              <p className="font-bold">{data[selectedValue]?.date.split('T')[0]}</p>
              <p className="text-sm">{data[length - 1]?.date.split('T')[0]}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TimeLine;
