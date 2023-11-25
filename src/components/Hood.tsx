import { Helmet } from "react-helmet";

interface IHoodProps {
  title: string;
}

export default function Hood({ title }: IHoodProps) {
  return (
    <Helmet>
      <title>{`96TALK\t-\t${title}\t`}</title>
    </Helmet>
  );
}
