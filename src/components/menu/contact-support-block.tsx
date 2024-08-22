import { AtSign } from 'lucide-react';

const ContactSupportBlock = ({ translate }: { translate: (key: string) => string }) => {
  return (
    <div className="group ml-3 flex items-center gap-2 pb-5 text-xs text-foreground">
      <AtSign size={16} />
      <a
        href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
        target="_blank"
        rel="noopener noreferrer"
        className="items-center text-secondary transition-all duration-300 ease-in-out hover:text-c42orange"
      >
        {translate(`contact-support`)}
      </a>
    </div>
  );
};

export default ContactSupportBlock;
