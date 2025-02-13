import { describe, it, expect, vi } from 'vitest';
import assignMergeRequestLabels from '@/infrastructure/assign-merge-request-labels.ts';

describe('assignMergeRequestLabels()', () => {
  const options: Parameters<typeof assignMergeRequestLabels>[0] = {
    labels: ['alpha', 'bravo', 'charlie'],
    parameter: {
      ACCESS_TOKEN: 'myPrivateAccessToken',
    },
    environment: {
      CI_API_V4_URL: 'https://gitlab.local/api/v4',
      CI_PROJECT_ID: 'myProjectId',
      CI_MERGE_REQUEST_IID: 'myMergeRequestIId',
    },
    config: {
      assignMethod: 'APPEND',
    },
  };
  it('should assign appending labels to merge request using a "PUT" api request', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    await assignMergeRequestLabels({ ...options, config: { assignMethod: 'APPEND' } });

    expect(fetchMock).toHaveBeenLastCalledWith(
      `${options.environment.CI_API_V4_URL}/projects/${options.environment.CI_PROJECT_ID}/${options.environment.CI_MERGE_REQUEST_IID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'PRIVATE-TOKEN': options.parameter.ACCESS_TOKEN,
        },
        body: JSON.stringify({ add_labels: options.labels.join(',') }),
      },
    );
  });
  it('should override labels of merge request using "PUT" api request', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    await assignMergeRequestLabels({ ...options, config: { assignMethod: 'OVERRIDE' } });

    expect(fetchMock).toHaveBeenLastCalledWith(
      `${options.environment.CI_API_V4_URL}/projects/${options.environment.CI_PROJECT_ID}/${options.environment.CI_MERGE_REQUEST_IID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'PRIVATE-TOKEN': options.parameter.ACCESS_TOKEN,
        },
        body: JSON.stringify({ labels: options.labels.join(',') }),
      },
    );
  });
  it('should throw exception if fetch request rejects', async () => {
    const fetchError = new Error('myFailure');
    vi.stubGlobal('fetch', () => Promise.reject(fetchError));

    await expect(assignMergeRequestLabels(options)).rejects.toThrow(
      new Error('Could not assign merge request labels.', { cause: fetchError }),
    );
  });
  it('should throw exception if fetch request response status is not OK', async () => {
    const fetchResponse = { ok: false, status: 400, json: vi.fn().mockResolvedValue({ error: 'Bad Request' }) };
    vi.stubGlobal('fetch', () => fetchResponse);

    await expect(assignMergeRequestLabels(options)).rejects.toThrow(
      new Error('Could not assign merge request labels.', {
        cause: new Error('GitLab API responded with bad status code 400.', { cause: { error: 'Bad Request' } }),
      }),
    );
  });
});
