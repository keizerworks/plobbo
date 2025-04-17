const palette = {
  green: {
    main: "bg-[#ECEFEB]",
    inner: "bg-[#BDC9B8]",
    center: "bg-[#E6E9E5]",
    border: "border-[#7A8077]",
  },
  violet: {
    main: "bg-[#F0ECF4]",
    inner: "bg-[#DDDAEB]",
    center: "bg-[#E6E9E5]",
    border: "border-[#7A8077]",
  },
  yellow: {
    main: "bg-[#F2F0E9]",
    inner: "bg-[#ECE7C9]",
    center: "bg-[#E6E9E5]",
    border: "border-[#7A8077]",
  },
  pink: {
    main: "bg-[#F8EBEC]",
    inner: "bg-[#E6C5C5]",
    center: "bg-[#E6E9E5]",
    border: "border-[#7A8077]",
  },
};

type PlobboCirclePalette = "green" | "yellow" | "violet" | "pink";

export const PlobboCircle = ({
  value = "green",
}: {
  value: PlobboCirclePalette;
}) => {
  const colors = palette[value];
  return (
    <div className={`relative w-[40px] h-[40px] group rounded-full`}>
      <div
        className={`${colors.border} border border-neutral-300 absolute inset-0 rounded-full ${colors.main} opacity-50 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100`}
      ></div>
      <div
        className={`absolute top-1/2 border border-neutral-300 left-1/2 w-[31px] h-[31px] -translate-x-1/2 -translate-y-1/2 rounded-full ${colors.inner}`}
      ></div>
      <div
        className={`absolute top-1/2 left-1/2 w-[8px] h-[8px] -translate-x-1/2 -translate-y-1/2 rounded-full ${colors.center}`}
      ></div>
    </div>
  );
};
