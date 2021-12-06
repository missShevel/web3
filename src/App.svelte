<script>
  import requestRunner from './requests/requests-runner';
  import { OperationsDocsHelper } from './requests/operation-docs-helper';
  import { ApolloClient, InMemoryCache } from '@apollo/client';
  import { setClient, subscribe } from 'svelte-apollo';
  import { WebSocketLink } from '@apollo/client/link/ws';

  function createApolloClient() {
    const wsLink = new WebSocketLink({
      uri: 'wss://weblaab-3.herokuapp.com/v1/graphql',
    });

    const cache = new InMemoryCache();
    return new ApolloClient({
      link: wsLink,
      cache,
    });
  }

  const client = createApolloClient();
  setClient(client);

  requestRunner.startFetchMyQuery(OperationsDocsHelper.QUERY_GetAll());

  const notes = subscribe(OperationsDocsHelper.SUBSCRIPTION_AllNotes);

  const addNote = async () => {
    const title = prompt('Note title') ?? '';
    const status = prompt('Task status') ?? '';
    if (title === '') return;
    await requestRunner.startExecuteMyMutation(
      OperationsDocsHelper.MUTATION_InsertOne(title, status),
    );
  };

  const deleteNote = async () => {
    const noteNumber = prompt("Notes' number to be deleted: " ?? '');
    await requestRunner.startExecuteMyMutation(
      OperationsDocsHelper.MUTATION_DeleteByNumber(),
      {
        number: parseInt(noteNumber),
      },
    );
  };

  function dateDisplay(d) {
    var datePart = d.substr(0, d.indexOf('T'));
    var timePart = d.substr(d.indexOf('T') + 1, 5);
    return datePart + ' ' + timePart;
  }
</script>

<main>
  {#if $notes.loading}
    <div class="loader">loading ...</div>
  {:else if $notes.error}
    <div class="error">Error!</div>
  {:else if $notes.data}
    <div class="limiter">
      <div class="container-table100">
        <div class="wrap-table100">
          <div class="table">
            <div class="row header">
              <div class="cell">№</div>
              <div class="cell">Title</div>
              <div class="cell">Date</div>
              <div class="cell">Status</div>
            </div>
            {#each $notes.data.notes_notes as note (note.id)}
              <div class="row">
                <div class="cell" data-title="Number">
                  {note.number}
                </div>
                <div class="cell" data-title="Title">
                  {note.note_title}
                </div>
                <div class="cell" data-title="Date">
                  {dateDisplay(note.creation_time)}
                </div>
                <div class="cell" data-title="Status">
                  {note.status}
                </div>
              </div>
            {/each}
          </div>
          <div class="buttons">
            <button class="btn" on:click={addNote}>Add Note</button>
            <button class="btn" on:click={deleteNote}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

  .limiter {
    width: 100%;
    margin: 0 auto;
  }

  .container-table100 {
    width: 100%;
    min-height: 100vh;
    background: #c4d3f6;

    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    padding: 33px 30px;
  }

  .wrap-table100 {
    width: 960px;
    border-radius: 10px;
    overflow: hidden;
  }

  .table {
    width: 100%;
    display: table;
    margin: 0;
  }

  .buttons {
    line-height: 20px;
    margin: 15px;
    display: flex;
    justify-content: center;
  }

  .btn {
    padding: 10px 10px;
    font-family: Poppins;
    font-size: 15px;
    color: #ffffff;
    margin: 10px;
    background-color: #6c7ae0;
    border-radius: 9px;
  }

  @media screen and (max-width: 768px) {
    .table {
      display: block;
    }
  }

  .row {
    display: table-row;
    background: #fff;
  }

  .row.header {
    color: #ffffff;
    background: #6c7ae0;
  }

  @media screen and (max-width: 768px) {
    .row {
      display: block;
    }

    .row.header {
      padding: 0;
      height: 0px;
    }

    .row.header .cell {
      display: none;
    }

    .row .cell:before {
      font-family: Poppins, sans-serif;
      font-size: 12px;
      color: #808080;
      line-height: 1.2;
      text-transform: uppercase;
      font-weight: unset !important;

      margin-bottom: 13px;
      content: attr(data-title);
      min-width: 98px;
      display: block;
    }
  }

  .cell {
    display: table-cell;
  }

  @media screen and (max-width: 768px) {
    .cell {
      display: block;
    }
  }

  .row .cell {
    font-family: Poppins, sans-serif;
    color: #666666;
    line-height: 1.2;
    font-weight: unset !important;

    padding-top: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f2f2f2;
  }

  .row.header .cell {
    font-family: Poppins, sans-serif;
    font-size: 18px;
    color: #fff;
    line-height: 1.2;
    font-weight: unset !important;

    padding-top: 19px;
    padding-bottom: 19px;
  }

  .row .cell:nth-child(1) {
    width: 160px;
    padding-left: 40px;
  }

  .row .cell:nth-child(2) {
    width: 360px;
  }

  .row .cell:nth-child(3) {
    width: 300px;
  }

  .row .cell:nth-child(4) {
    width: 140px;
  }

  .table,
  .row {
    width: 100% !important;
  }

  .row:hover {
    background-color: #ececff;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .row {
      border-bottom: 1px solid #f2f2f2;
      padding-bottom: 18px;
      padding-top: 30px;
      padding-right: 15px;
      margin: 0;
    }

    .table,
    .row,
    .cell {
      width: 100% !important;
    }
    .row .cell {
      border: none;
      padding-left: 30px;
      padding-top: 16px;
      padding-bottom: 16px;
      font-family: Poppins, sans-serif;
      font-size: 18px;
      color: #555555;
      line-height: 1.2;
      font-weight: unset !important;
    }

    .row .cell:nth-child(1) {
      padding-left: 30px;
    }
  }
</style>
