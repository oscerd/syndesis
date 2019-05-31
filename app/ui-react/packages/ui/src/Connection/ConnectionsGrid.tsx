import { CardGrid } from 'patternfly-react';
import * as React from 'react';

export class ConnectionsGrid extends React.Component {
  public render() {
    return (
      <CardGrid fluid={true} matchHeight={true}>
        <CardGrid.Row>{this.props.children}</CardGrid.Row>
      </CardGrid>
    );
  }
}
