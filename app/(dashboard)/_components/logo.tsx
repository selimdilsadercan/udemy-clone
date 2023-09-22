import Image from "next/image";

const Logo = () => {
  return (
    <Image
      alt="logo"
      src="logo.svg"
      priority={true}
      width={130}
      height={32}
      sizes="(height: auto)"
    />
  );
};

export default Logo;
