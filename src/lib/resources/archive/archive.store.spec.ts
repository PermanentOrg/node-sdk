import anyTest, { TestInterface } from 'ava';

import { PermSdkError } from '../../error';
import { FolderVO } from '../../model';

import { ArchiveStore } from '.';

const test = anyTest as TestInterface<{
  archiveStore: ArchiveStore;
}>;

test.beforeEach((t) => {
  t.context = {
    archiveStore: new ArchiveStore(),
  };
});

test('returns the private root folder', (t) => {
  const root: FolderVO = {
    folderId: 1,
    folder_linkId: 1,
    ChildItemVOs: [
      {
        folderId: 2,
        folder_linkId: 2,
        type: 'type.folder.root.public',
      },
      {
        folderId: 3,
        folder_linkId: 3,
        type: 'type.folder.root.private',
      },
      {
        folderId: 4,
        folder_linkId: 4,
        type: 'type.folder.root.share',
      },
    ],
  };

  t.context.archiveStore.setRoot(root);

  const privateRoot = t.context.archiveStore.getPrivateRoot();

  if (root.ChildItemVOs?.length) {
    t.is(root.ChildItemVOs[1], privateRoot);
  } else {
    t.fail();
  }
});

test('throws error if getPrivateRoot called before init()', (t) => {
  const error = t.throws(() => {
    t.context.archiveStore.getPrivateRoot();
  });

  t.assert(error.message.includes('init'));
  t.assert(error instanceof PermSdkError);
});
