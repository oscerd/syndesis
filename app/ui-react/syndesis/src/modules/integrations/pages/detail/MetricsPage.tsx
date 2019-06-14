import {
  WithIntegrationMetrics,
  WithMonitoredIntegration,
} from '@syndesis/api';
import { IntegrationDetailMetrics, PageLoader } from '@syndesis/ui';
import {
  toDurationDifferenceString,
  WithLoader,
  WithRouteData,
} from '@syndesis/utils';
import * as React from 'react';
import { Translation } from 'react-i18next';
import { AppContext } from '../../../../app';
import { ApiError, PageTitle } from '../../../../shared';
import {
  IntegrationDetailHeader,
  WithIntegrationActions,
} from '../../components';
import resolvers from '../../resolvers';
import { IDetailsRouteParams, IDetailsRouteState } from './interfaces';

/**
 * This page shows the third tab of the Integration Detail page.
 *
 * This component expects either an integrationId in the URL,
 * or an integration object set via the state.
 *
 */
export class MetricsPage extends React.Component {
  public render() {
    return (
      <>
        <Translation ns={['integrations', 'shared']}>
          {t => (
            <AppContext.Consumer>
              {({ getPodLogUrl }) => (
                <WithRouteData<IDetailsRouteParams, IDetailsRouteState>>
                  {({ integrationId }, { integration }) => {
                    return (
                      <WithMonitoredIntegration
                        integrationId={integrationId}
                        initialValue={integration}
                      >
                        {({ data, hasData, error }) => (
                          <WithIntegrationMetrics integrationId={integrationId}>
                            {({ data: metricsData }) => (
                              <WithLoader
                                error={error}
                                loading={!hasData}
                                loaderChildren={<PageLoader />}
                                errorChildren={<ApiError />}
                              >
                                {() => (
                                  <WithIntegrationActions
                                    integration={data.integration}
                                    postDeleteHref={resolvers.list()}
                                  >
                                    {({
                                      ciCdAction,
                                      editAction,
                                      deleteAction,
                                      exportAction,
                                      startAction,
                                      stopAction,
                                    }) => {
                                      return (
                                        <>
                                          <PageTitle
                                            title={t(
                                              'integrations:detail:pageTitle'
                                            )}
                                          />
                                          <IntegrationDetailHeader
                                            data={data}
                                            startAction={startAction}
                                            stopAction={stopAction}
                                            deleteAction={deleteAction}
                                            ciCdAction={ciCdAction}
                                            editAction={editAction}
                                            exportAction={exportAction}
                                            getPodLogUrl={getPodLogUrl}
                                          />
                                          <IntegrationDetailMetrics
                                            i18nUptime={t(
                                              'integrations:metrics:uptime'
                                            )}
                                            i18nTotalMessages={t(
                                              'integrations:metrics:totalMessages'
                                            )}
                                            i18nTotalErrors={t(
                                              'integrations:metrics:totalErrors'
                                            )}
                                            i18nSince={t(
                                              'integrations:metrics:since'
                                            )}
                                            i18nLastProcessed={t(
                                              'integrations:metrics:lastProcessed'
                                            )}
                                            errors={metricsData.errors}
                                            lastProcessed={
                                              typeof metricsData.lastProcessed !==
                                              'undefined'
                                                ? new Date(
                                                    metricsData.lastProcessed
                                                  ).toLocaleString()
                                                : t('shared:NA')
                                            }
                                            messages={metricsData.messages}
                                            start={parseInt(
                                              metricsData.start!,
                                              10
                                            )}
                                            durationDifference={toDurationDifferenceString(
                                              parseInt(metricsData.start!, 10)
                                            )}
                                          />
                                        </>
                                      );
                                    }}
                                  </WithIntegrationActions>
                                )}
                              </WithLoader>
                            )}
                          </WithIntegrationMetrics>
                        )}
                      </WithMonitoredIntegration>
                    );
                  }}
                </WithRouteData>
              )}
            </AppContext.Consumer>
          )}
        </Translation>
      </>
    );
  }
}
