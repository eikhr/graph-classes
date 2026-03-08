import { notFound } from "next/navigation";
import { graphClasses } from "@/data/graph-classes";
import { GraphExplainer } from "@/components/graph-explainer";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return graphClasses.map((gc) => ({ id: gc.id }));
}

export default async function ClassPage({ params }: Props) {
  const { id } = await params;
  const graphClass = graphClasses.find((gc) => gc.id === id);

  if (!graphClass) {
    notFound();
  }

  const superclassData = graphClasses.filter((gc) =>
    graphClass.superclasses.includes(gc.id),
  );

  return (
    <main>
      <h1>{graphClass.name}</h1>
      <p>{graphClass.description}</p>

      {graphClass.examples.map((example, i) => (
        <section key={i}>
          <GraphExplainer example={example} />
        </section>
      ))}

      {superclassData.length > 0 && (
        <section>
          <h2>Superclasses</h2>
          <ul>
            {superclassData.map((sc) => (
              <li key={sc.id}>
                <a href={`/classes/${sc.id}`}>{sc.name}</a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2>References</h2>
        <ul>
          {graphClass.references.map((ref, i) => (
            <li key={i}>
              <a href={ref.url} target="_blank" rel="noopener noreferrer">
                {ref.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
