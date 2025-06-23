import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Events({ events }: { events: any[] }) {
  return (
    <ul>
    {
      events.map((event, index) =>
        <li key={ index }>{ event }</li>
      )
    }
    </ul>
  );
}