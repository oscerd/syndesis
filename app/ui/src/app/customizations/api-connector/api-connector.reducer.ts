import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import { BaseReducerModel, PlatformStore } from '@syndesis/ui/platform';
import { ApiConnectorState } from './api-connector.models';
import {
  ApiConnectorActions,
  ApiConnectorFetchComplete,
  ApiConnectorFetchFail
} from './api-connector.actions';

const initialState: ApiConnectorState = {
  list             : [],
  createRequest    : null,
  loading          : false,
  loaded           : false,
  hasErrors        : false,
  errors           : []
};

export function apiConnectorReducer(state = initialState, action: any): ApiConnectorState {
  switch (action.type) {
    case ApiConnectorActions.VALIDATE_SWAGGER: {
      return {
        ...state,
        createRequest: action.payload,
        loading: true,
        hasErrors: false,
        errors: []
      };
    }

    case ApiConnectorActions.VALIDATE_SWAGGER_COMPLETE: {
      return {
        ...state,
        createRequest: { ...state.createRequest, ...action.payload },
        loading: false,
        hasErrors: false,
        errors: []
      };
    }

    case ApiConnectorActions.VALIDATE_SWAGGER_FAIL: {
      return {
        ...state,
        loading: false,
        hasErrors: true,
        errors: [action.payload]
      };
    }

    case ApiConnectorActions.FETCH: {
      return {
        ...state,
        loading: true,
        hasErrors: false,
        errors: []
      };
    }

    case ApiConnectorActions.FETCH_COMPLETE: {
      const list = (action as ApiConnectorFetchComplete).payload;
      return {
        ...state,
        list,
        loading: false,
        loaded: true,
        hasErrors: false,
        errors: []
      };
    }

    case ApiConnectorActions.FETCH_FAIL: {
      const error = (action as ApiConnectorFetchFail).payload;
      return {
        ...state,
        loading: false,
        loaded: true,
        hasErrors: true,
        errors: [error]
      };
    }

    default: {
      return state;
    }
  }
}

export interface ApiConnectorStore extends PlatformStore {
  apiConnectorState: ApiConnectorState;
}

export const getApiConnectorState = createFeatureSelector<ApiConnectorState>('apiConnectorState');
