import * as React from 'react';

import * as Toast from '@radix-ui/react-toast';

import { ButtonMatcha } from './ui/button-matcha';

const ToastNotification = () => {
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <Toast.Provider swipeDirection="right">
      <ButtonMatcha
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => {
          setOpen(false);
          window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => {
            setOpen(true);
          }, 100);
        }}
      >
        {' '}
        SHOW TOAST
      </ButtonMatcha>

      <Toast.Root
        className="data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-2xl border bg-card/90 p-[15px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className="mb-[5px] text-[15px] font-medium text-foreground [grid-area:_title]">
          Toast.Title
        </Toast.Title>
        <Toast.Description asChild>
          <p>SOME TEXT</p>
        </Toast.Description>
        <Toast.Action className="[grid-area:_action]" asChild altText="Goto schedule to undo">
          <button className="text-green11 shadow-green7 hover:shadow-green8 focus:shadow-green8 inline-flex h-[25px] items-center justify-center rounded bg-background px-2.5 text-xs font-medium leading-[25px] shadow-[inset_0_0_0_1px] hover:shadow-[inset_0_0_0_1px] focus:shadow-[0_0_0_2px]">
            ButtonText
          </button>
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
    </Toast.Provider>
  );
};

export default ToastNotification;
