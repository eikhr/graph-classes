"use client";

import { FaWikipediaW } from "react-icons/fa";
import styles from "./external-links.module.css";

type Reference = {
  title: string;
  url: string;
};

type ExternalLinksProps = {
  references: Reference[];
};

export function ExternalLinks({ references }: ExternalLinksProps) {
  return (
    <div className={styles["links"]}>
      {references.map((ref, i) => {
        const isWikipedia = ref.url.includes("wikipedia.org");
        const isISGCI = ref.url.includes("graphclasses.org");
        const label = isWikipedia
          ? "Wikipedia"
          : isISGCI
            ? "graphclasses.org"
            : ref.title;

        return (
          <a
            key={i}
            href={ref.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles["link"]}
            title={label}
          >
            {isWikipedia ? (
              <FaWikipediaW size={18} />
            ) : isISGCI ? (
              <img
                src="https://www.graphclasses.org/favicon.ico"
                alt="graphclasses.org"
                width={18}
                height={18}
                className={styles["favicon"]}
              />
            ) : (
              <span className={styles["arrow"]}>&#x2197;</span>
            )}
          </a>
        );
      })}
    </div>
  );
}
