import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  {
    error: null | Error;
    info: unknown;
  }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      error: null,
      info: null,
    };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(error, errorInfo);
    this.setState({ error, info: errorInfo });
  }
  render() {
    const { error, info } = this.state;

    if (!error) {
      return this.props.children;
    }

    return (
      <div>
        <h1>Vaya... Algo salió mal!!</h1>
        <div>
          <code>{error.message}</code>
        </div>
        <div>
          <code>{JSON.stringify(info)}</code>
        </div>
      </div>
    );
  }
}
