import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-ink group-[.toaster]:border group-[.toaster]:border-ink/20 group-[.toaster]:shadow-lg",
          title: "group-[.toast]:text-ink",
          description: "group-[.toast]:text-ink/70",
          icon: "group-[.toast]:text-ink",
          actionButton: "group-[.toast]:bg-ink group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-ink/10 group-[.toast]:text-ink",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
