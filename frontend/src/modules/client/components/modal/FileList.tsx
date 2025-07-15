type File = {
  id: number;
  name: string;
  url: string;
};

type Props = {
  files: File[];
};

export const FileList = ({ files }: Props) => {
  return (
    <ul>
      {files.map((file) => (
        <li key={file.id}>
          <a href={file.url} target="_blank" rel="noreferrer">
            {file.name}
          </a>
        </li>
      ))}
    </ul>
  );
};
