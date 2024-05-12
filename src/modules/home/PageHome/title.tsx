export default function Title({
  title,
  subTitle,
  icon: Icon,
}: {
  title: string;
  subTitle: string;
  icon: React.FC;
}) {
  return (
    <>
      <p className="flex gap-1 font-semibold mobile:text-sm">
        <Icon />
        {title}
      </p>
      <p className="mt-4 text-xs text-white/60 mobile:text-xxs">{subTitle}</p>
    </>
  );
}
