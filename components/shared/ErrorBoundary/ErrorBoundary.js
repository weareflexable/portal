
import React from "react"
import {Button, Card, Typography} from 'antd'

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props)
  
      // Define a state variable to track whether is an error or not
      this.state = { hasError: false }
    }
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI
  
      return { hasError: true }
    }
    componentDidCatch(error, errorInfo) {
      // You can use your own error logging service here
      console.log({ error, errorInfo })
    }
    render() {
      // Check if the error is thrown
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return (
          <Card>
            <Typography.Title level={3}>- We seem to have encountered a technical error in {this.props.name}!</Typography.Title>
            <Button
              shape="round"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again?
            </Button>
          </Card>
        )
      }
  
      // Return children components in case of no error
  
      return this.props.children
    }
  }
  
  export default ErrorBoundary