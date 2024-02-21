/* istanbul ignore file */
import React from "react";
import Error from "../public/components/error/Error";

export class ErrorBoundry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    let localStorageInfo = [],
      keys = Object.keys(localStorage),
      i = keys.length;

    while (i--) {
      localStorageInfo.push({ [keys[i]]: localStorage.getItem(keys[i]) });
    }

    const data = {
      currentPath: window.location.pathname,
      windowHistory: JSON.stringify(window.history.state),
      localStorageInfo: localStorageInfo,
      message: error.message,
      error: error,
      errorInfo: errorInfo,
    };

    console.error(data);
  }

  render() {
    if (this.state.hasError) {
      return <Error />;
    }
    return this.props.children;
  }
}
