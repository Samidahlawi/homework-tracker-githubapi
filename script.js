$(document).ready(() => {
  $("#logo").attr("src", logo);
  let toggleLeaderboard = false;
  let leaderboard = [];
  let toggleMissingHw = false;
  const missingHw = [];
  const secret = `&client_id=${clientId}&client_secret=${clientSecret}`;

  // fetch
  const sendReminder = (user, repo) => {
    console.log(user, repo);

    let msg =
      "hey :wave:, this is an auto generated reminder about your hw " +
      "`" +
      `${repo.slice(repo.indexOf("/") + 1)}` +
      "`" +
      ` \nhttps://github.com/${repo}`;
    console.log(msg);

    // comments this line, this is just for testing
    user.slack = "UDVTZMFHT"; // Ghadeer id

    fetch(
      `${slackApi}/chat.postMessage?token=${token}&channel=${
        user.slack
      }&text=${msg}&as_user=true&pretty=1`
    )
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => console.log(error));
  };
  const fetchHwRepos = () => {
    const query = `${hwPattern}+fork:true+user:${mainRepo}&sort=updated&order=asc`;
    const url = `${githubApi}/search/repositories?q=${query}${secret}`;
    fetch(url)
      .then(response => response.json())
      .then(repos => {
        filterRepos(repos);
      })
      .catch(error => console.log(error));
  };

  const fetchPulls = url => {
    fetch(url)
      .then(response => response.json())
      .then(pulls => {
        renderPulls(pulls);
      })
      .catch(error => console.log(error));
  };

  // render
  const renderPulls = pulls => {
    if (pulls[0]) {
      const submittedStudents = [];
      const $tbody = $(`#${pulls[0].base.repo.id}`);

      let dueDate = new Date(pulls[0].base.repo.created_at.slice(0, 10));

      if (dueDate.getDay() === 4) {
        dueDate.setDate(dueDate.getDate() + 2);
      }

      pulls.forEach((pull, index) => {
        const i = students
          .map(student => student.github)
          .indexOf(pull.user.login);
        if (i > -1) {
          const $tr = $("<tr>");
          let hwPot = null;
          $("<th>")
            .html(
              `
            <img src="https://avatars2.githubusercontent.com/u/${
              pull.user.id
            }" class="rounded-circle" alt="avatar" width="50"/>
              `
            )
            .css({ "max-width": "55px" })
            .appendTo($tr);

          $("<th>")
            .html(
              `
          <a href="https://github.com/${pull.base.repo.full_name}/pull/${
                pull.number
              }?${secret}"> ${students[i].name} </a>`
            )
            .css({ "max-width": "55px" })
            .appendTo($tr);

          $("<th>")
            .text(new Date(pull.created_at).toGMTString())
            .css({ "max-width": "55px" })
            .appendTo($tr);

          $("<th>")
            .text(
              pull.closed_at ? new Date(pull.closed_at).toGMTString() : null
            )
            .css({ "max-width": "55px" })
            .appendTo($tr);

          $("<th>")
            .text(pull.body)
            .css({ "max-width": "200px" })
            .appendTo($tr);

          if (index < 5) {
            rank =
              index == 0 ? "st" : index == 1 ? "nd" : index == 1 ? "rd" : "th";
            hwPot =
              `You won the ${index + 1 + rank}  place ${pull.user.login} ` +
              "⭐️".repeat(5 - index);

            updateLeaderboard(pull.user.login, "⭐️ ".repeat(5 - index));
          }
          $("<th>")
            .text(hwPot ? hwPot : "")
            .css({ "max-width": "55px" })
            .appendTo($tr);

          let submissionDate = new Date(pull.created_at.slice(0, 10));
          pull.closed_at != null
            ? $tr.attr("class", "alert alert-success")
            : $tr.attr("class", "alert alert-info");

          if (
            pull.created_at != null &&
            submissionDate > dueDate &&
            pull.closed_at != null
          ) {
            $tr.attr("class", "alert alert-warning");
          }

          submittedStudents.push(pull.user.login);
          $tr.appendTo($tbody);
        }
      });

      console.log(leaderboard);
      checkMissingSubmission(
        submittedStudents,
        $tbody,
        pulls[0].base.repo.full_name
      );
    }
  };

  const renderRepo = repo => {
    // console.log(repo.name);
    if (!repo.name.includes("W01D01")) {
      const $repo = $("<div>").attr("class", "container bg-light p-5 mt-5");

      $("<h2>")
        .attr("class", "text-center")
        .text(repo.name)
        .appendTo($repo);
      $("<h3>")
        .attr("class", "text-center")
        .text(new Date(repo.created_at).toGMTString())
        .appendTo($repo);

      $(`
      <table class='table table-hover table-sm table-responsive-sm' style="width: 100% !important;">
        <thead>
          <tr>
            <th></th>
            <th>UserName</th>
            <th>Submission Date</th>
            <th>Complete Date</th>
            <th>Comments</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id=${repo.id}>
        </tbody>
      </table>`).appendTo($repo);
      $repo.appendTo("#result");
    }
  };

  // helper functions
  const filterRepos = repos => {
    repos.items.forEach(repo => {
      renderRepo(repo);
      fetchPulls(
        `https://api.github.com/repos/${
          repo.full_name
        }/pulls?state=all&sort=created&direction=asc${secret}`
      );
    });
  };

  const checkMissingSubmission = (submittedStudents, $tbody, repo) => {
    console.log(repo, `https://github.com/${repo}`);

    const missingSubmission = students.filter(
      value => -1 === submittedStudents.indexOf(value.github)
    );

    // TO DO: RENDER ALL THE MISSING HW
    // if (missingSubmission.length > 0)
    //   missingHw.push({
    //     repo: {
    //       name: repo,
    //       link: `https://github.com/${repo}`,
    //       students: missingSubmission
    //     }
    //   });
    // console.log(missingHw);

    if (missingSubmission.length > 0) {
      missingSubmission.forEach(student => {
        const $tr = $("<tr>").attr("class", "alert alert-danger");

        const $th = $("<th>");

        $("<th>")
          .html(
            ` <img src="https://media.giphy.com/media/TU76e2JHkPchG/giphy.gif" class="rounded-circle" alt="avatar" width="50"/>`
          )
          .css({ "max-width": "55px" })
          .appendTo($tr);

        $("<th>")
          .html(
            `<a href="https://github.com/${student.github}" target="_blank"> ${
              student.name
            } </a>`
          )
          .css({ "max-width": "55px" })
          .appendTo($tr);

        $("<th>")
          .text("missing!")
          .css({ "max-width": "55px" })
          .appendTo($tr);
        $("<th>")
          .text("missing!")
          .css({ "max-width": "55px" })
          .appendTo($tr);

        $("<th>")
          .html("missing!")
          .css({ "max-width": "200px" })
          .appendTo($tr);
        $("<th>")
          .html(`<button class="btn btn-primary"> send Reminder </button>`)
          .click(() => sendReminder(student, repo))
          .css({ "max-width": "55px" })
          .appendTo($tr);

        $tr.appendTo($tbody);
      });
    }
  };

  const updateLeaderboard = (name, stars) => {
    let found = false;

    leaderboard.sort((a, b) => {
      return b.stars.length - a.stars.length;
    });

    leaderboard.forEach((student, index) => {
      if (student.name === name) {
        found = true;
        leaderboard[index].stars += stars;
      }
    });

    if (!found && name != "trevorpreston") {
      leaderboard.push({ name, stars });
    }
  };

  const renderLeaderboard = () => {
    $("#leaderboard").empty();

    $("#leaderboard").html(
      leaderboard.map((student, index) => {
        return `
          <p class="p-5 mt-5"> 
            ${index + 1} - ${student.name} 
            with ${student.stars.split(" ").length - 1} ..⭐️ stars 
            <br> ${student.stars} 
          </p>`;
      })
    );
  };

  // TO DO: RENDER ALL THE MISSING HW
  // $("#MissingHwBtn").click(() => {
  //   toggleMissingHw = !toggleMissingHw;
  //   toggleMissingHw ? renderMissingHw() : $("#missingHw").empty();
  // });

  $("#leaderboardBtn").click(() => {
    toggleLeaderboard = !toggleLeaderboard;
    toggleLeaderboard ? renderLeaderboard() : $("#leaderboard").empty();
  });
  fetchHwRepos();
});
