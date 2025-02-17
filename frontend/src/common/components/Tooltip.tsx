import React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';

export const Tooltip = ({
  children,
  content,
  delayDuration = 500,
}: {
  children: React.ReactNode;
  content?: string;
  delayDuration?: number;
}) => {
  return (
    <>
      {content ? (
        <RadixTooltip.Provider delayDuration={delayDuration}>
          <RadixTooltip.Root>
            <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
            <RadixTooltip.Portal>
              <RadixTooltip.Content
                arrowPadding={10}
                className="transition-all animate-slideUpAndFade duration-1000 ease-in-out select-none pointer-events-none"
              >
                <RadixTooltip.Arrow className="fill-secondary-500"></RadixTooltip.Arrow>

                <div className="bg-secondary-500 rounded-md p-2 text-sm select-none pointer-events-none">
                  {content}
                </div>
              </RadixTooltip.Content>
            </RadixTooltip.Portal>
          </RadixTooltip.Root>
        </RadixTooltip.Provider>
      ) : (
        <div>{children}</div>
      )}
    </>
  );
};
