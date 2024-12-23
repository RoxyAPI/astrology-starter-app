import { Text as DefaultText } from "react-native";

type TextProps = {
  children: React.ReactNode;
  className?: string;
};

const Text = ({ children, className }: TextProps) => {
  return (
    <DefaultText selectable className={`text-white ${className}`}>
      {children}
    </DefaultText>
  );
};

export default Text;
