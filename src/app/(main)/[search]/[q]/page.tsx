interface pageProps {
  params: {
    q: string;
  };
}

export default function Search({ params: { q } }: pageProps) {
  return (
    <>
      <div>{q}</div>
    </>
  );
}
