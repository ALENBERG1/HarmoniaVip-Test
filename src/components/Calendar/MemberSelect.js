import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'; // Aggiunto getDocs
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export default function MemberSelect({ onChange, selectedMembers }) {
  const [adminMembers, setAdminMembers] = useState([]);
  const [parentMember, setParentMember] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Recupera tutti gli amministratori
        const adminsSnapshot = await getDocs(collection(db, 'users'));
        const admins = [];
        adminsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.plan === 'admin') {
            admins.push({
              id: doc.id,
              name: data.username || data.firstName || 'Utente',
            });
          }
        });
        setAdminMembers(admins);

        // Recupera il parent_id specifico dell'utente loggato
        if (user && user.parent_id) {
          const parentDocRef = doc(db, 'users', user.parent_id);
          const parentDocSnap = await getDoc(parentDocRef);
          if (parentDocSnap.exists()) {
            setParentMember({
              id: parentDocSnap.id,
              name: parentDocSnap.data().username || parentDocSnap.data().firstName || 'Sponsor',
            });
          } else {
            setParentMember(null);
          }
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    if (user) {
      fetchMembers();
    }
  }, [user]);

  const handleChange = (memberId) => {
    const updatedSelection = selectedMembers.includes(memberId)
      ? selectedMembers.filter(id => id !== memberId)
      : [...selectedMembers, memberId];
    onChange(updatedSelection);
  };

  const renderMember = (member) => (
    <div key={member.id} className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={`member-${member.id}`}
        checked={selectedMembers.includes(member.id)}
        onChange={() => handleChange(member.id)}
        className="form-checkbox h-5 w-5 text-blue-600"
      />
      <label htmlFor={`member-${member.id}`} className="text-gray-300">
        {member.name} (ID: {member.id})
      </label>
    </div>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Amministratori</h3>
      <div className="space-y-2">
        {adminMembers.length > 0 ? (
          adminMembers.map(renderMember)
        ) : (
          <p className="text-gray-300">Nessun amministratore disponibile</p>
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-white mt-4">Sponsor</h3>
      <div className="space-y-2">
        {parentMember ? (
          renderMember(parentMember)
        ) : (
          <p className="text-gray-300">Non esiste sponsor</p>
        )}
      </div>
    </div>
  );
}
