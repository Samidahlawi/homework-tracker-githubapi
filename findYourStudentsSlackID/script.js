// slack
$(document).ready(() => {
  // fetch
  const fetchAllPrivateChannels = () => {
    fetch(
      `${slackApi}/conversations.list?token=${token}&types=private_channel&pretty=1`
    )
      .then(response => response.json())
      .then(data => {
        let c = data.channels.map(channel => {
          console.log(channel);
          return { id: channel.id, name: channel.name };
        });
        renderChannels(c);
      })
      .catch(error => console.log(error));
  };

  const fetchMemberInfo = id => {
    fetch(`${slackApi}/users.info?token=${token}&user=${id}&pretty=1`)
      .then(response => response.json())

      .then(data => {
        renderMember({
          id: data.user.id,
          name: data.user.name,
          realName: data.user.real_name,
          displayName: data.user.profile.display_name
        });
      })
      .catch(error => console.log(error));
  };

  const fetchChannelMembers = id => {
    fetch(
      `${slackApi}/conversations.members?token=${token}&channel=${id}&limit=100&pretty=1`
    )
      .then(response => response.json())
      .then(data => {
        data.members.forEach(member => fetchMemberInfo(member));
      })
      .catch(error => console.log(error));
  };

  // render
  const renderChannels = channels => {
    const $mainChannel = $("<div>").attr(
      "class",
      "container bg-light p-5 mt-5"
    );

    $("<h1> click on a channel </h1>").appendTo("#result");

    channels.forEach(channel => {
      $("<h2>")
        .attr("class", "text-center")
        .attr("id", channel.id)
        .text(channel.name)
        .appendTo($mainChannel)
        .click(e => fetchChannelMembers(e.target.id));
    });

    $mainChannel.appendTo("#result");

    $(
      "<h1>  Add The members id you want to track thier hw inside the student Array </h1>"
    )
      .attr("class", "mt-5")
      .appendTo("#result");

    $(`
    <table class='table table-sm table-responsive-sm' style="width: 100% !important;">
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>realName</th>
          <th>displayName</th>
        </tr>
      </thead>
      <tbody id="members">
      </tbody>
    </table>`).appendTo("#result");
  };

  const renderMember = member => {
    const $tbody = $("#members");
    const $tr = $("<tr>");

    $("<th>")
      .text(member.id)
      .appendTo($tr);

    $("<th>")
      .text(member.name)
      .appendTo($tr);

    $("<th>")
      .text(member.realName)
      .appendTo($tr);

    $("<th>")
      .text(member.displayName)
      .appendTo($tr);

    $tr.appendTo($tbody);
  };

  fetchAllPrivateChannels();
});
