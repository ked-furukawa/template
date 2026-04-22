import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

const backend = defineBackend({
  auth,
  data,
  storage,
});

const { cfnUserPool } = backend.auth.resources.cfnResources;
cfnUserPool.usernameAttributes = [];
cfnUserPool.aliasAttributes = undefined;
cfnUserPool.schema = [
  {
    name: 'email',
    attributeDataType: 'String',
    mutable: true,
    required: false,
  },
];
cfnUserPool.autoVerifiedAttributes = [];
cfnUserPool.userAttributeUpdateSettings = undefined;
