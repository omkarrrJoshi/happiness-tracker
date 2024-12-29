
export const EllipsisMenu = ({ menuRef }) => {
    return (
        <div ref={menuRef} className='menu'>
        <ul>
            <li onClick={() => console.log('Update')}>Update</li>
            <li onClick={() => console.log('Delete')}>Delete</li>
            <li onClick={() => console.log('Link')}>Link</li>
        </ul>
        </div>
    );
  };