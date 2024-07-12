export default async function Home(
  props: Readonly<{ children: React.ReactNode }>,
) {
  return <div className="flex flex-1 overflow-hidden">{props.children}</div>;
}
