import { Component } from "react";
import { useLocation } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button, Card } from "./ui.jsx";

class ErrorBoundaryInner extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(previousProps) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="grid min-h-screen place-items-center bg-slate-50 p-4 dark:bg-slate-950">
          <Card className="max-w-2xl">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-red-100 p-3 text-red-700 dark:bg-red-950 dark:text-red-200">
                <AlertTriangle />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-950 dark:text-white">Something went wrong</h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  The page hit a runtime error. This message is shown by the app ErrorBoundary so the screen does not go blank.
                </p>
                <pre className="mt-4 max-h-56 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-white">
                  {this.state.error?.message || "Unknown error"}
                </pre>
                <Button className="mt-4" onClick={() => this.setState({ error: null })}>
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function ErrorBoundary({ children }) {
  const location = useLocation();
  return <ErrorBoundaryInner resetKey={location.pathname}>{children}</ErrorBoundaryInner>;
}
