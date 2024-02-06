import { Helmet } from "react-helmet";

interface IHoodProps {
  title: string;
}

/**
 * 브라우저 상단 탭 component
 *
 * @param title 추가할 브라우저 명
 * @returns
 */
export default function Hood({ title }: IHoodProps) {
  return (
    <Helmet>
      <title>{`96TALK\t-\t${title}\t`}</title>
    </Helmet>
  );
}
