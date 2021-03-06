import { Injectable } from '@angular/core';
import 'jquery.fancytree';
import { UUID } from 'angular2-uuid';
import {editorConfig} from '../../editor.config';
declare var $: any;

import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class TreeService {
  config: any = editorConfig;
  treeCache = {
    nodesModified: {},
    nodes: []
  };

  treeNativeElement: any;

  constructor() { }

  getTreeObject() {
    return $(this.treeNativeElement).fancytree('getTree');
  }

  getHierarchy() {

  }

  setTreeElement(el) {
    this.treeNativeElement = el;
  }

  addNode(objectType, data, createType) {
    let newNode;
    data = data || {};
    const selectedNode = this.getActiveNode();
    const node: any = {};
    node.title = data.name ? (data.name) : 'Untitled ' + objectType.label;
    node.tooltip = data.name;
    node.objectType = data.contentType || objectType.type;
    node.id = data.identifier ? data.identifier : UUID.UUID();
    node.root = false;
    node.folder = (data.visibility && data.visibility === 'Default') ? false : (objectType.childrenTypes.length > 0);
    node.icon = (data.visibility && data.visibility === 'Default') ? 'fa fa-file-o' : objectType.iconClass;
    node.metadata = data;
    if (node.folder) {
      // to check child node should not be created more than the set configlevel
      if ((selectedNode.getLevel() >= this.config.editorConfig.rules.levels - 1) && createType === 'child') {
        alert('Sorry, this operation is not allowed.');
        return;
      }
      newNode = (createType === 'sibling') ? selectedNode.appendSibling(node) : selectedNode.addChildren(node);
      if (_.isEmpty(newNode.data.metadata)) {
        // tslint:disable-next-line:max-line-length
        newNode.data.metadata = { mimeType: 'application/vnd.ekstep.content-collection', contentType: _.get(this.getActiveNode(), 'data.objectType'), code: node.id, name: node.title };
      }
      // tslint:disable-next-line:max-line-length
      // const modificationData = { isNew: true, root: false, metadata: { mimeType: 'application/vnd.ekstep.content-collection', contentType: _.get(this.getActiveNode(), 'data.objectType'), code: node.id, name: node.title } };
      // tslint:disable-next-line:max-line-length
      const metadata = { mimeType: 'application/vnd.ekstep.content-collection', contentType: _.get(this.getActiveNode(), 'data.objectType'), code: node.id, name: node.title };
      this.setTreeCache(node.id, metadata);
    } else {
      newNode = (createType === 'sibling') ? selectedNode.appendSibling(node) : selectedNode.addChildren(node);
    }
    newNode.setActive();
    // selectedNode.sortChildren(null, true);
    selectedNode.setExpanded();
    $('span.fancytree-title').attr('style', 'width:11em;text-overflow:ellipsis;white-space:nowrap;overflow:hidden');
    $(this.treeNativeElement).scrollLeft($('.fancytree-lastsib').width());
    $(this.treeNativeElement).scrollTop($('.fancytree-lastsib').height());
  }

  removeNode() {
    const selectedNode = this.getActiveNode();
    const afterDeleteNode = selectedNode.getPrevSibling() ? selectedNode.getPrevSibling() : selectedNode.getParent();
    this.setActiveNode(afterDeleteNode);
    selectedNode.remove();
    $('span.fancytree-title').attr('style', 'width:11em;text-overflow:ellipsis;white-space:nowrap;overflow:hidden');
    $(this.treeNativeElement).scrollLeft($('.fancytree-lastsib').width());
    $(this.treeNativeElement).scrollTop($('.fancytree-lastsib').height());
  }

  getActiveNode() {
    return $(this.treeNativeElement).fancytree('getTree').getActiveNode();
  }

  setActiveNode(node) {
    node.setActive(true);
  }

  getFirstChild() {
    // console.log($(this.treeNativeElement).fancytree('getRootNode').getChildren());
    return $(this.treeNativeElement).fancytree('getRootNode').getFirstChild();
  }

  findNode(nodeId) {
    return $(this.treeNativeElement).fancytree('getTree').findFirst((node) => node.data.id === nodeId);
  }

  expandNode(nodeId) {
    this.findNode(nodeId).setExpanded(true);
  }

  replaceNodeId(identifiers) {
    $(this.treeNativeElement).fancytree('getTree').visit((node) => {
      if (identifiers[node.data.id]) {
        node.data.id = identifiers[node.data.id];
      }
    });
  }

  updateNodeMetadata(newData, nodeId) {
    $(this.treeNativeElement).fancytree('getTree').visit((node) => {
      if (nodeId === node.data.id) {
        this.checkModification(node, newData);
        node.data.metadata = {...node.data.metadata, ...newData.metadata};
        node.title = newData.metadata.name;
        return;
      }
    });
  }

  checkModification(node, newData) {
    const oldMetadata = _.get(node, 'data.metadata');
    const newMetadata = _.pickBy(_.get(newData, 'metadata'), _.identity);
    if (oldMetadata) {
      for (const key in newMetadata) {
        if (typeof(oldMetadata[key]) === typeof(newMetadata[key])) {
          // tslint:disable-next-line:max-line-length
          if ((typeof(newMetadata[key]) === 'string' || typeof(newMetadata[key]) === 'number')  && oldMetadata[key] !== newMetadata[key]) {
            // tslint:disable-next-line:max-line-length
            // const modificationData = {root: false, metadata: {..._.pick(newMetadata, key)}, ...(node.data.id.includes('do_') ? {isNew: false} : {isNew: true})};
            this.setTreeCache(node.data.id, _.pick(newMetadata, key));
          // tslint:disable-next-line:max-line-length
          } else if (typeof(newMetadata[key]) === 'object' && (newMetadata[key].length !== oldMetadata[key].length || _.difference(oldMetadata[key], newMetadata[key]).length)) {
            // tslint:disable-next-line:max-line-length
            // const modificationData = {root: false, metadata: {..._.pick(newMetadata, key)}, ...(node.data.id.includes('do_') ? {isNew: false} : {isNew: true})};
            this.setTreeCache(node.data.id, _.pick(newMetadata, key));
          }
        }
      }
    }
  }

  setTreeCache(nodeId, data) {
    if (this.treeCache.nodesModified[nodeId]) {
      this.treeCache.nodesModified[nodeId]['metadata'] = {...this.treeCache.nodesModified[nodeId]['metadata'], ...data};
    } else {
      // tslint:disable-next-line:max-line-length
      this.treeCache.nodesModified[nodeId] = {root: false, metadata: {...data}, ...(nodeId.includes('do_') ? {isNew: false} : {isNew: true})};
      this.treeCache.nodes.push(nodeId); // To track sequence of modifiation
    }
  }

  clearTreeCache(node?) {
    if (node) {
      delete this.treeCache.nodesModified[node.id];
      _.remove(this.treeCache.nodes, val => val === node.id);
    } else {
      this.treeCache.nodesModified = {};
      this.treeCache.nodes = [];
    }
  }

  setNodeTitle(nTitle) {
    console.log('before Title ------>', nTitle);
    if (!nTitle) {
      nTitle = 'Untitled';
    }
    // title = instance.removeSpecialChars(title);
    console.log('Title ------>', nTitle);
    this.getActiveNode().applyPatch({ title: nTitle }).done((a, b) => {
      // instance.onRenderNode(undefined, { node: ecEditor.jQuery(‘#collection-tree’).fancytree(‘getTree’).getActiveNode() }, true)
    });
    $('span.fancytree-title').attr('style', 'width:11em;text-overflow:ellipsis;white-space:nowrap;overflow:hidden');
  }

  closePrevOpenedDropDown() {
    $(this.treeNativeElement).fancytree('getTree').visit((node) => {
      const nSpan = $(node.span);

      const dropDownElement = $(nSpan[0]).find(`#contextMenuDropDown`);
      dropDownElement.addClass('hidden');
      dropDownElement.removeClass('visible');
    });
  }
}
