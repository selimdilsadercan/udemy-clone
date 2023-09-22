import { ClerkProvider as ClerkProviderRow } from "@clerk/nextjs";

interface Props {
  children: React.ReactNode;
}

const ClerkProvider = ({ children }: Props) => {
  return <ClerkProviderRow>{children}</ClerkProviderRow>;
};

export default ClerkProvider;
