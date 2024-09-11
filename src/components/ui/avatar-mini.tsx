import * as Avatar from '@radix-ui/react-avatar';
import clsx from 'clsx';

import { formatUserNameOneLetter } from '@/utils/format-string';

const AvatarMini = ({
  src,
  nickname,
  rounded,
  width,
  height,
}: {
  src: string;
  nickname: string;
  rounded?: boolean;
  width?: number;
  height?: number;
}) => (
  <Avatar.Root
    className={clsx(
      'inline-flex select-none items-center justify-center overflow-hidden bg-foreground align-middle',
      rounded ? 'rounded-full' : 'rounded-2xl',
      width ? `w-${width}` : 'w-11',
      height ? `h-${height}` : 'h-11'
    )}
  >
    <Avatar.Image
      className="h-full w-full rounded-[inherit] object-cover"
      src={src}
      alt={nickname}
    />
    <Avatar.Fallback
      className="flex h-full w-full items-center justify-center bg-foreground text-base text-card"
      //delayMs={100}
    >
      {nickname && formatUserNameOneLetter(nickname)}
    </Avatar.Fallback>
  </Avatar.Root>
);

export default AvatarMini;
