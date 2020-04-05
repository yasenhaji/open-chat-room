import produce, {produceWithPatches, enablePatches, applyPatches} from 'immer';

enablePatches();

export const openChatReducer = produce((draft, action) => {
    switch(action.type) {
        case 'ADD_MESSAGE':
            const { message } = action;
            draft.messages.push(message);
            break;
        case 'ADD_USER':
            draft.connectedUsers.push({name: action.name});
            break;
        case 'APPLY_PATCHES':
            return applyPatches(draft, action.patches);
    }
});

export const patchesGeneratingOpenChatReducer = produceWithPatches((draft, action) => {
    switch(action.type) {
        case 'ADD_MESSAGE':
            const { message } = action;
            draft.messages.push(message);
            break;
        case 'ADD_USER':
            draft.connectedUsers[action.id] = {id: action.id,name: action.name};
            break;
        case 'REMOVE_USER':
            delete draft.connectedUsers[action.id];
            break;
        case 'APPLY_PATCHES':
            return applyPatches(draft, action.patches);
    }
});