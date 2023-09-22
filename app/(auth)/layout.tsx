interface Props {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      {children}
    </div>
  );
};

export default AuthLayout;
