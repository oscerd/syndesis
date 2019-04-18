import * as H from 'history';
import * as React from 'react';
import { Link } from 'react-router-dom';
import './IntegrationFlowAddStep.css';

export interface IIntegrationFlowAddStepProps {
  showDetails: boolean;
  forceTooltip?: boolean;
  addStepHref?: H.LocationDescriptor;
  i18nAddStep?: string;
}

export interface IIntegrationFlowAddStepState {
  showTooltip: boolean;
}

export class IntegrationFlowAddStep extends React.Component<
  IIntegrationFlowAddStepProps,
  IIntegrationFlowAddStepState
> {
  public static defaultProps = {
    active: false,
  };

  public state = {
    forceTooltip: false,
    showTooltip: false,
  };

  public containerRef = React.createRef<HTMLDivElement>();

  constructor(props: IIntegrationFlowAddStepProps) {
    super(props);
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
    this.toggleTooltip = this.toggleTooltip.bind(this);
  }

  public showTooltip() {
    this.setState({
      showTooltip: true,
    });
  }

  public hideTooltip() {
    this.setState({
      showTooltip: false,
    });
  }

  public toggleTooltip() {
    this.setState({
      showTooltip: !this.state.showTooltip,
    });
  }

  public render() {
    return (
      <div
        className={'integration-flow-add-step'}
        onMouseEnter={this.showTooltip}
        onMouseLeave={this.hideTooltip}
        onTouchStart={this.toggleTooltip}
      >
        {this.props.addStepHref && (
          <div
            className={'integration-flow-add-step__iconWrapper'}
            ref={this.containerRef}
          >
            <Link to={this.props.addStepHref}>
              <div className={'integration-flow-add-step__icon'}>
                <i
                  className="fa fa-plus-square"
                  title={this.props.i18nAddStep}
                />
              </div>
            </Link>
          </div>
        )}
        {this.props.showDetails && this.props.children}
      </div>
    );
  }
}
