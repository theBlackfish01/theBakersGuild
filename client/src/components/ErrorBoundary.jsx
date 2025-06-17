// client/src/components/ErrorBoundary.jsx
import React from "react";
import { Alert } from "@mui/joy";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, err: null };
    }
    static getDerivedStateFromError(err) {
        return { hasError: true, err };
    }
    render() {
        if (this.state.hasError) {
            return (
                <Alert variant="soft" color="danger">
                    Something went wrong: {this.state.err?.message}
                </Alert>
            );
        }
        return this.props.children;
    }
}