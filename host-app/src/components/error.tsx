import React from "react";

type ErrorProps = {
  message?: string;
  refetch?: () => void;
};
const Error = ({ message = "Unknown Error", refetch }: ErrorProps) => {
  return (
    <div>
      <h2>Error</h2>
      <p>{message}</p>
      <button onClick={refetch} type="button">
        try again
      </button>
    </div>
  );
};

export default Error;
