import { counter } from '../store';

class RequestRunner {
  constructor() {
    this.API_URL = 'https://weblaab-3.herokuapp.com/v1/graphql';
  }
  async fetchGraphQL(operationsDoc, operationName, variables) {
    try {
      const result = await fetch(this.API_URL, {
        method: 'POST',
        body: JSON.stringify({
          query: operationsDoc,
          variables: variables,
          operationName: operationName,
        }),
      });
      return result.json();
    } catch (e) {
      console.error(e);
      throw new Error('Error with sending requesr occured');
    }
  }
  fetchMyQuery(operationsDoc) {
    return this.fetchGraphQL(operationsDoc, 'MyQuery', {});
  }

  async startFetchMyQuery(operationsDoc) {
    counter.update((n) => n + 1);
    const { errors, data } = await this.fetchMyQuery(operationsDoc);
    counter.update((n) => n - 1);
    if (errors) {
      console.error(errors);
      throw new Error(errors[0].message);
    }

    console.log(data);
    return data;
  }

  executeMyMutation(operationsDoc, variables = {}) {
    return this.fetchGraphQL(operationsDoc, 'MyMutation', variables);
  }

  async startExecuteMyMutation(operationsDoc, variables = {}) {
    counter.update((n) => n + 1);
    const { errors, data } = await this.executeMyMutation(
      operationsDoc,
      variables,
    );
    counter.update((n) => n - 1);

    if (errors) {
      console.error(errors);
      throw new Error(errors[0].message);
    }

    console.log(data);
    return data;
  }
}
export default new RequestRunner();
