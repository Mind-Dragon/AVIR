interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

interface TeamGridProps {
  members: TeamMember[];
}

export default function TeamGrid({ members }: TeamGridProps) {
  return (
    <div className="team__grid" data-wf-class="team__grid">
      {members.map((member) => (
        <div
          key={member.name}
          className="team__item"
          data-wf-class="team__item"
        >
          <div
            className="team__item-photo"
            data-wf-class="team__item-photo"
          />
          <h3 className="team__item-name" data-wf-class="team__item-name">
            {member.name}
          </h3>
          <div
            className="team__item-role"
            data-wf-class="team__item-role"
          >
            {member.role}
          </div>
          <p className="team__item-bio" data-wf-class="team__item-bio">
            {member.bio}
          </p>
        </div>
      ))}
    </div>
  );
}
