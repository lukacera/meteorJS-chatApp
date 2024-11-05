import React from 'react';
import { Hello } from './Hello.jsx';
import { Info } from './Info.jsx';
import { useTracker } from 'meteor/react-meteor-data';
import { LinksCollection } from '/imports/api/links';

export const App = () => {
  const links = useTracker(() => {
    const handle = Meteor.subscribe('links');
    return LinksCollection.find().fetch();
  });

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <h1 className="display-4 mb-4">Welcome to Meteor!</h1>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <Hello />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <Info />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h2 className="h4 mb-0">Links</h2>
            </div>
            <div className="card-body">
              {links.length === 0 ? (
                <p className="text-muted">No links found</p>
              ) : (
                <div className="list-group">
                  {links.map(link => (
                    <div key={link._id} className="list-group-item">
                      <h3 className="h5 mb-2">{link.title}</h3>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                      >
                        <i className="bi bi-link-45deg me-2"></i>
                        Visit Link
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};